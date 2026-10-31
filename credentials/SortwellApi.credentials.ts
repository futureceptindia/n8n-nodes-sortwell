import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class SortwellApi implements ICredentialType {
  name = 'sortwellApi';
  displayName = 'Sortwell API';
  documentationUrl = 'https://www.sortwell.xyz/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Sortwell API Key (starts with ev_live_). Obtain it from Sortwell Dashboard > Settings > API Keys.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://www.sortwell.xyz',
      description: 'Override base URL for custom domains, staging, or local testing',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'x-api-key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/v1/account',
      method: 'GET',
    },
  };
}

