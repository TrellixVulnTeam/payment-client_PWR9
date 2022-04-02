export const regexpPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~])[A-Za-z\d`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]{8,}$/;

export const ErrorPattern = {
  oneLowercaseLetter: /[a-z]/,
  oneUppercaseLetter: /[A-Z]/,
  oneNumberLetter: /(?=.*\d)/,
  oneSpecialCharacter: /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/,
  minEightCharacters: /(^.{8,})/,
};

export const ErrorMessage = {
  oneLowercaseLetter: 'At least 1 lower-case letter',
  oneUppercaseLetter: 'At least 1 upper-case letter',
  oneNumberLetter: 'At least 1 number letter',
  oneSpecialCharacter: 'At least 1 special character (ex: #, @, $)',
  minEightCharacters: 'At least 8 characters',
};
