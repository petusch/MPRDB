import { Sequelize } from 'sequelize';
import Database from '../log/Database'

const hook = (model, type) => {
  if (!model) return;
  let _model = model;
  let data;

  if (Array.isArray(model)) {
    [_model] = model;

    data = model.map(entity => entity.toJSON());
  } else {
    data = model.toJSON();
  }

  const {
    _modelOptions: { tableName: table },
  } = _model;

  const database = new Database({
    data,
    date: new Date(),
    table,
    type,
  });

  database.save();
};

const sequelize = new Sequelize('hospital', 'postgres', '', {
  dialect: 'postgres',
  host: 'localhost',
  define: {
    hooks: {
      afterCreate: model => hook(model, 'Create'),
      afterDestroy: model => hook(model, 'Desctroy'),
      afterFind: model => hook(model, 'Find'),
      afterUpdate: model => dbHook(model, 'Update'),
    }
  }
});

module.exports = sequelize;