import avro from 'avsc';

export const messageType = avro.Type.forSchema({
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