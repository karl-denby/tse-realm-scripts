// Define your models and their properties
const CarSchema = {
  name: 'Car',
  properties: {
    make: 'string',
    model: 'string',
    distance: { type: 'int', default: 0 },
    distance_unit: 'string'
  }
}

const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
    birthday: 'date',
    cars: 'Car[]',
    picture: 'data?' // optional property
  }
}

module.exports = {
  CarSchema,
  PersonSchema
}
