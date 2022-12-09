import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

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
        TIME_ZONE: 'America/Chicago',
      },
      logRetention: RetentionDays.ONE_WEEK,
    })
  }
}
