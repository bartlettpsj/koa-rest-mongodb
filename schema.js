module.exports = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  title: "Aeroplane Schema",
  description: "An aircraft from Porky Airways inventory",
  type: "object",
  properties: {
    id: {
      description: "The unique identifier for a aircraft",
      type: "integer"
    },
    name: {
      description: "Name of the aircraft",
      type: "string"
    },
    price: {
      type: "number",
      minimum: 0,
      exclusiveMinimum: 0
    }
  },
  required: ["id", "name", "price"],
  additionalProperties: false
}
