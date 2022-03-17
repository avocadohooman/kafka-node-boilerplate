const { Kafka } = require('kafkajs');


const establishKafkaBroker = async () => {
	const kafka = await new Kafka({
		"clientId": "myApp",
		"brokers": ["localhost:9092"],
	});

	const kafkaAdmin = kafka.admin();
	console.log('Connecting ...');
	await kafkaAdmin.connect();
	console.log('Connectd!');
	await kafkaAdmin.createTopics({
		"topics": [{
			"topic": "Users",
			"numPartitions": 2,
		}]
	});
	console.log('Created Users topic!');
	await kafkaAdmin.disconnect();
}

const runMain = async () => {
	try {
		await establishKafkaBroker();
		process.exit(0);
	} catch (error) {
		console.log('error', error);
		process.exit(1);
	}
}

runMain();