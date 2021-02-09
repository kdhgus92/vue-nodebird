module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(40), // 40자 이내
        allowNull: false, // 필수
      },
      nickaname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", //한글 저장돼요
    }
  );
  User.associate = (db) => {};
  return User;
};