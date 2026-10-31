import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';
import { emailFields, emailOperations } from './descriptions/EmailDescription';
import { accountFields, accountOperations } from './descriptions/AccountDescription';

export class Sortwell implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sortwell',
    name: 'sortwell',
    icon: 'file:sortwell.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Verify and clean email addresses in real-time with Sortwell',
    defaults: {
      name: 'Sortwell',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'sortwellApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Email',
            value: 'email',
          },
          {
            name: 'Account',
            value: 'account',
          },
        ],
        default: 'email',
      },
      ...emailOperations,
      ...emailFields,
      ...accountOperations,
      ...accountFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('sortwellApi');
    const baseUrl = ((credentials.baseUrl as string) || 'https://www.sortwell.xyz').replace(/\/+$/, '');
    const apiKey = (credentials.apiKey as string) || '';

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    if (resource === 'account' && operation === 'getBalance') {
      try {
        const response = await this.helpers.request({
          method: 'GET',
          url: `${baseUrl}/api/v1/account`,
          headers: {
            'x-api-key': apiKey,
            'Accept': 'application/json',
          },
          json: true,
        });

        if (response && response.success && response.data) {
          returnData.push({
            json: response.data,
            pairedItem: { item: 0 },
          });
        } else {
          returnData.push({
            json: response,
            pairedItem: { item: 0 },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: (error as Error).message },
            pairedItem: { item: 0 },
          });
        } else {
          throw new NodeApiError(this.getNode(), error as any);
        }
      }
      return [returnData];
    }

    if (resource === 'email' && operation === 'verify') {
      for (let i = 0; i < items.length; i++) {
        try {
          const email = this.getNodeParameter('email', i) as string;

          if (!email || typeof email !== 'string' || !email.includes('@')) {
            throw new NodeOperationError(
              this.getNode(),
              `Invalid email address provided for item ${i}: "${email}". An email containing "@" is required.`,
              { itemIndex: i }
            );
          }

          const response = await this.helpers.request({
            method: 'POST',
            url: `${baseUrl}/api/v1/verify`,
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: {
              email: email.trim(),
            },
            json: true,
          });

          if (response && response.success && response.data) {
            returnData.push({
              json: {
                ...response.data,
                creditsRemaining: response.creditsRemaining,
              },
              pairedItem: { item: i },
            });
          } else {
            returnData.push({
              json: response,
              pairedItem: { item: i },
            });
          }
        } catch (error: any) {
          const status = error.statusCode || error.response?.status;
          if (status === 402) {
            const insufficientMsg = 'Sortwell: Insufficient verification credits. Please top up your credits in the Sortwell dashboard.';
            if (this.continueOnFail()) {
              returnData.push({
                json: { error: insufficientMsg, statusCode: 402 },
                pairedItem: { item: i },
              });
              continue;
            }
            throw new NodeOperationError(this.getNode(), insufficientMsg, { itemIndex: i });
          }

          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: error.message || 'Unknown verification error',
                statusCode: status || 500,
              },
              pairedItem: { item: i },
            });
            continue;
          }

          throw new NodeApiError(this.getNode(), error);
        }
      }
    }

    return [returnData];
  }
}

