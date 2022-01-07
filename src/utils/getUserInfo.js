const getUserInfo = (users, userLoggedin) => {
  //console.log('getMatchedUserInf users', users);
  const newUser = {...users};
  delete newUser[userLoggedin];

  const [id, user] = Object.entries(newUser).flat();
  return {id, ...user};
};

export default getUserInfo;
