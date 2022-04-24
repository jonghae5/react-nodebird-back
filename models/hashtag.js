const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Hashtag extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: 'Hashtag',
        tableName: 'hashtags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  }
};
// module.exports = (sequelize, DataTypes) => {
//   const Hashtag = sequelize.define(
//     'Hashtag',
//     {
//       // id가 기본적으로 탑재
//       name: {
//         type: DataTypes.STRING(20),
//         allowNull: false, // 필수
//       },
//     },
//     {
//       charset: 'utf8mb4',
//       collate: 'utf8mb4_general_ci', //한글 + 이모티콘 저장
//     }
//   );

//   Hashtag.associate = db => {
//     db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
//   };
//   return Hashtag;
// };
