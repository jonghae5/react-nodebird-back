module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // 자동으로 MySQL에서 users 로 저장
      // id가 기본적으로 탑재
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, // unique key
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // 필수
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci', //한글 저장
    }
  );

  User.associate = db => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers', // 목적
      foreignKey: 'FollowingId', // 본인(팔로우 하는 것)
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings', // 목적
      foreignKey: 'FollowerId', // 본인(팔로워 당하는 것)
    });
  };
  return User;
};
