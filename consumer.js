import { Kafka } from 'kafkajs';
import avro from 'avsc';

const messageType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{
			name: 'name',
			type: 'string'
		},
		{
			name: 'email',
			type: 'string'
		}
	]
});
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
			console.log(`received message: ${messageType.fromBuffer(result.message.value)} on partiion ${result.partition}`);
			userDb.push(messageType.fromBuffer(result.message.value));
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