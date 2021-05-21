const ec2 = require('@aws-cdk/aws-ec2');

module.exports = {
    Parameters: {
        awsParam: ec2.SubnetType.PRIVATE
    }
}