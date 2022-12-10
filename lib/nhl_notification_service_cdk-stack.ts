import * as cdk from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { StringParameter } from 'aws-cdk-lib/aws-ssm'; 

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
        TIME_ZONE: StringParameter.valueForStringParameter(this, 'nhNotifcationTimeZone'),
        TEAM_NAME: StringParameter.valueForStringParameter(this, 'nhNotifcationTeamName'),
        WEBHOOK_URL: StringParameter.valueForStringParameter(this, 'nhlNotificationWebhookUrl'),
      },
      logRetention: RetentionDays.ONE_WEEK,
    })

    const eventRule = new Rule(this, 'scheduleRule', {
      schedule: Schedule.cron({ minute: '0', hour: '17' }),
    });
    eventRule.addTarget(new LambdaFunction(lambda));
  }
}
