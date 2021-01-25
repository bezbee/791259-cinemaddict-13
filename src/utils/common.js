export const getRuntime = (minutesCount) => {
  const hours = Math.floor(minutesCount / 60);
  const minutes = minutesCount % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getRank = (watchedFilms) => {
  let rank;
  if (watchedFilms.length <= 10) {
    rank = `Novice`;
  }
  if (watchedFilms.length > 11 || watchedFilms.length <= 20) {
    rank = `Fan`;
  }
  if (watchedFilms.length > 21) {
    rank = `Movie Buff`;
  }
  return rank;
};
