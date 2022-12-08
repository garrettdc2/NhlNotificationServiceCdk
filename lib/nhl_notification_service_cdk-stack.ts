import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NhlNotificationServiceCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'NhlNotificationService', {
      description: 'Lambda that creates notifications of nhl events',
      code: Code.fromAsset(
        '../nhlNotificationServiceLambda/lambda.zip'
      ),
      runtime: Runtime.PROVIDED_AL2,
      handler: 'notification-handler',
      environment: {
        RUST_BACKTRACE: '1',
      },
      logRetention: RetentionDays.ONE_WEEK,
    })
  }
}
