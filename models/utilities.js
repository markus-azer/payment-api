const ValidationError = require('mongoose').Error.ValidationError;
const ValidatorError = require('mongoose').Error.ValidatorError;


const asyncIdGenerator = {
  // eslint-disable-next-line object-shorthand
  generate: function (length, startingCharacter) { // eslint-disable-line func-names
    const chars = '123456789';
    let id = startingCharacter;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      id += chars[Math.floor(Math.random() * 9)];
    }
    return id;
  },
  /**
  * @param {Object} $this
  * @param {String} initialCharacter
  * @param {Number} length
  */

  // eslint-disable-next-line object-shorthand
  generateUniqueId: // eslint-disable-line func-names
    async function ($this, initialCharacter, length) { // eslint-disable-line func-names
    // eslint-disable-next-line func-names
      const generateIdAndCheckUniqueness = async function ($this) { // eslint-disable-line no-shadow
        const id = asyncIdGenerator.generate(length, initialCharacter);

        const countNum = await $this.constructor.countDocuments({ id });

        return (countNum) ? generateIdAndCheckUniqueness($this) : id;
      };

      return generateIdAndCheckUniqueness($this);
    },
};

const validObjectID = mongoId => /^[0-9a-fA-F]{24}$/.test(mongoId);
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// eslint-disable-next-line no-shadow
const lockedFields = ($this, lockedFields) => {
  const updatedLockedFields = lockedFields.filter(lockedField => $this.isModified(lockedField));

  if (!$this.isNew && updatedLockedFields && updatedLockedFields.length >= 1) {
    const error = new ValidationError($this);
    updatedLockedFields.forEach((updatedLockedField) => {
      error.errors[updatedLockedField] = new ValidatorError({
        message: `${updatedLockedField} is Locked`,
        type: 'locked',
        path: updatedLockedField,
        value: $this[updatedLockedField],
      });
    });
    throw error;
  }
};

// eslint-disable-next-line no-shadow
const modelFields = ($this, modelFields) => {
  const updatedModelFields = modelFields.filter(modelField => $this.isModified(modelField));

  if (updatedModelFields && updatedModelFields.length >= 1) {
    const error = new ValidationError($this);
    updatedModelFields.forEach((updatedModelField) => {
      error.errors[updatedModelField] = new ValidatorError({
        message: `${updatedModelField} is Locked`,
        type: 'locked',
        path: updatedModelField,
        value: $this[updatedModelField],
      });
    });
    throw error;
  }
};
module.exports = {
  asyncIdGenerator,
  validObjectID,
  objectIdRegex,
  lockedFields,
  modelFields,
};
