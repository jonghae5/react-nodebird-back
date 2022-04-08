module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    'Hashtag',
    {
      // id가 기본적으로 탑재
      name: {
        type: DataTypes.STRING(20),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', //한글 + 이모티콘 저장
    }
  );

  Hashtag.associate = db => {
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  };
  return Hashtag;
};
