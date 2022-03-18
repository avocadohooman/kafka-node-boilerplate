const { Kafka } = require('kafkajs');

const msg = process.argv[2];

const establishProducer = async () => {
	const kafka = await new Kafka({
		"clientId": "myApp",
		"brokers": ["localhost:9092"],
	});

	const kafkaProducer = kafka.producer({
		"idempotent": true,
		"retry": 10000000,
	});
	console.log('Connecting ...');
	await kafkaProducer.connect();
	console.log('Connectd!');
	const partition = msg[0] < 'N' ? 0 : 1;
	try {
		const response = await kafkaProducer.send({
			"topic": "Users",
			"messages": [
				{
					"value": msg,
					"partition": partition,
				}
			],
			"acks": -1,
		})
		console.log('Message successfully sent:', JSON.stringify(response));
		await kafkaProducer.disconnect();	
	} catch (error) {
		console.log(error);
		await kafkaProducer.disconnect();
	}
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