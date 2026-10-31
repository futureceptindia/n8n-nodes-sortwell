import { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['account'],
      },
    },
    options: [
      {
        name: 'Get Balance & Quota',
        value: 'getBalance',
        description: 'Get remaining verification credits, active plan, and account info',
        action: 'Get account credits and plan',
      },
    ],
    default: 'getBalance',
  },
];

export const accountFields: INodeProperties[] = [];

