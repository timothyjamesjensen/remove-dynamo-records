const hashKey = "";
const rangeKey = null;
const tableName = "";
const region = "";

const AWS = require("aws-sdk");

const scanParams = {
    TableName: tableName,
};

const docClient = new AWS.DynamoDB.DocumentClient({"region": region});

const scanDelete = () => {

    docClient.scan(scanParams, function(err, data) {
        if (err) console.log(err); // an error occurred
        else {
            data.Items.forEach(function(obj,i){
                console.log(i);
                console.log(obj);
                var params = {
                    TableName: scanParams.TableName,
                    Key: buildKey(obj),
                    ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
                    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
                    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
                };

                docClient.delete(params, function(err, data) {
                    if (err) console.log(err); // an error occurred
                    else console.log(data); // successful response
                });

            });
        }

        // continue scanning if we have more items
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            scanDelete();
        }
    });
}

const buildKey = (obj) => {
    var key = {};
    key[hashKey] = obj[hashKey]
        if(rangeKey){
            key[rangeKey] = obj[rangeKey];
        }

    return key;
}

scanDelete();
