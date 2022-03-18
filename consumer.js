const { Kafka } = require('kafkajs');

const userDb = [];

const establishConsumer = async () => {
	const kafka = await new Kafka({
		"clientId": "myApp",
		"brokers": ["localhost:9092"],
	});

	const kafkaConsumer = kafka.consumer({
		"groupId": "test",
	});
	console.log('Connecting ...');
	await kafkaConsumer.connect();
	console.log('Connectd!');

	await kafkaConsumer.subscribe({
		"topic": "Users",
		"fromBeginning": true,
	});

	await kafkaConsumer.run({
		"eachMessage": async result => {
			console.log(`received message: ${result.message.value} on partiion ${result.partition}`);
			userDb.push(result.message.value.toString());
			console.log(`${result.message.value} added to DB`);
			console.log(userDb);
		}
	});
}

const runMain = async () => {
	try {
		await establishConsumer();
	} catch (error) {
		console.log('error', error);
		process.exit(1);
	}
}

runMain();