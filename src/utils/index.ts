const parseJson = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.log("Error", error);
    return false;
  }
};

export { parseJson };
