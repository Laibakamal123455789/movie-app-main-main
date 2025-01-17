export default {
  getNameFromEmail(email) {
    if (!email || typeof email !== "string") return "Guest";
    return email.split("@")[0];
  },
};
