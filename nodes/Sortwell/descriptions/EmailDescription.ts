import { INodeProperties } from 'n8n-workflow';

export const emailOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['email'],
      },
    },
    options: [
      {
        name: 'Verify',
        value: 'verify',
        description: 'Verify a single email address in real time with SMTP, MX, syntax, disposable, and deliverability checks',
        action: 'Verify an email',
      },
    ],
    default: 'verify',
  },
];

export const emailFields: INodeProperties[] = [
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@company.com',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['email'],
        operation: ['verify'],
      },
    },
    description: 'The email address to verify (accepts expressions from previous nodes)',
  },
];

