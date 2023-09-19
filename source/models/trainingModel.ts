import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")

class trainingModel extends Model {

  public trainingTitle!: string;
  public skillTitle!: string;
  public skillCategory!: string;
  public startDateTime!: string;
  public endDateTime!: string;
  public description!: string;
  public limit!: string;

}

trainingModel.init(
  {
    trainingId: {
      type: DataTypes.STRING,
      primaryKey:true
    },
    trainingTitle: {
      type: DataTypes.STRING
    },
    skillTitle: {
      type: DataTypes.STRING
    },
    skillCategory: {
      type: DataTypes.STRING
    },
    startDateTime: {
      type: DataTypes.STRING
    },
    endDateTime: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    limit: {
      type: DataTypes.INTEGER,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    }
  },
  {
    tableName: 'TrainingDetails',
    sequelize,
  }
);

export { trainingModel };
