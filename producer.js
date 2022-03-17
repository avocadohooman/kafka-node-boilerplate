const { Kafka } = require('kafkajs');

const msg = process.argv[2];

const establishProducer = async () => {
	const kafka = await new Kafka({
		"clientId": "myApp",
		"brokers": ["localhost:9092"],
	});

	const kafkaProducer = kafka.producer();
	console.log('Connecting ...');
	await kafkaProducer.connect();
	console.log('Connectd!');
	const partition = msg[0] < 'N' ? 0 : 1;
	const response = await kafkaProducer.send({
		"topic": "Users",
		"messages": [
			{
				"value": msg,
				"partition": partition
			}
		]
	});
	console.log('Message successfully sent:', JSON.stringify(response));
	await kafkaProducer.disconnect();
}

const runMain = async () => {
	try {
		await establishProducer();
		process.exit(0);
	} catch (error) {
		console.log('error', error);
		process.exit(1);
	}
}

runMain();