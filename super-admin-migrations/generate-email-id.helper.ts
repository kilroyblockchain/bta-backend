export const getRandomEmail = (domain: string, length: number): string => {
    var email = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) email += possible.charAt(Math.floor(Math.random() * possible.length));

    return email + domain;
  };
