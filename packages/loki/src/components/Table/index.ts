import faker from 'faker';
// faker.locale = 'vi';

export type Employee = {
  avatar: string;
  firstName: string; // ✅️
  lastName: string; // ✅️
  email: string;
  id: string;
  phone: string;
  dateOfBirth?: {
    seconds: number;
    nanos: number;
  };
  jobTitle: string; // ✅️
  department: string; // ✅️
  team: string; // ✅️
  contract: string;
  status: string;
  expiryDate?: {
    seconds: number;
    nanos: number;
  };
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

function getRandomDate(start: Date, end: Date) {
  let date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );

  return {
    seconds: Math.floor(date.getTime() / 1000), // https://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
    nanos: 0,
  };
}

function getDate() {
  return getRandomDate(new Date(2010, 0, 1), new Date(2021, 0, 1));
}

function getRandomExpiryDate() {
  return getRandomDate(new Date(2021, 5, 1), new Date(2025, 0, 1));
}

function getRandomContract() {
  let contractTypes = ['CONTRACT_TYPE_UNSPECIFILED', 'FULLTIME', 'PARTTIME'];
  let rand = Math.floor(Math.random() * contractTypes.length);
  return contractTypes[rand];
}

function getRandomStatus() {
  let statuses = ['ACTIVE', 'BLOCKED', 'DISABLE', 'STATUS_TYPE_UNSPECIFILED'];
  let rand = Math.floor(Math.random() * statuses.length);
  return statuses[rand];
}

function getRamMerchant() {
  const jobTitles = [
    {
      id: getRandomID(),
      name: 'J Dawgs',
    },
    {
      id: getRandomID(),
      name: 'AT&T',
    },
    {
      id: getRandomID(),
      name: 'Etsy',
    },
    {
      id: getRandomID(),
      name: 'Spotify',
    },
    {
      id: getRandomID(),
      name: 'Xbox',
    },
    {
      id: getRandomID(),
      name: 'HBO Max',
    },
    {
      id: getRandomID(),
      name: 'Amazon',
    },
    {
      id: getRandomID(),
      name: 'Home depot',
    },
  ];
  let randomIndex = Math.floor(Math.random() * jobTitles.length);
  return jobTitles[randomIndex];
}

function getRandomRole() {
  const departments = [
    'Manager',
    'Corporate',
    'Team leader',
    'Onsite subcontractor',
    'Administrator',
    'Worker',
  ];
  let randomIndex = Math.floor(Math.random() * departments.length);
  return departments[randomIndex];
}

function getRandomTeam() {
  const teams = [
    'Graphic',
    'Game Design',
    'UI/UX',
    'Art',
    'Product',
    'Technical',
  ];
  let randomIndex = Math.floor(Math.random() * teams.length);
  return teams[randomIndex];
}

// https://gist.github.com/jarvisluong/f01e108e963092336f04c4b7dd6f7e45
function nonAccentVietnamese(str: string) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ|Đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

const getNamesAndEmailFromFaker = (): {
  firstName: string;
  lastName: string;
  email: string;
} => {
  let fakerFirstName = faker.name.firstName();
  let fakerLastName = faker.name.lastName();

  let firstName = fakerFirstName.split(' ')[0];
  let middleName = fakerFirstName.split(' ')[1];
  let lastName = fakerLastName + ' ' + middleName;

  let email = faker.internet.exampleEmail(
    nonAccentVietnamese(firstName),
    nonAccentVietnamese(lastName),
  );

  return {
    firstName,
    lastName,
    email,
  };
};

const getRandomID = () => {
  const randomNumber = faker.datatype.number(10000);
  const ID = randomNumber.toString().padStart(6, '0');

  return `#${ID}`;
};

// const getRandomTrue = (ratio?: number) => {
//   if (!ratio) ratio = 0.5;
//   let randomNum = Math.random();
//   if (randomNum > ratio) return true;
//   return false;
// };

const getRandomAvatar = () => {
  return faker.internet.avatar();
};

const newEmployee = (): any => {
  let { firstName, lastName, email } = getNamesAndEmailFromFaker();
  let { id: merchantId, name: merchantName } = getRamMerchant();
  return {
    avatar: getRandomAvatar(),
    firstName,
    lastName,
    username: faker.internet.userName(),
    fullName: `${firstName} ${lastName}`,
    email,
    id: getRandomID(),
    phone: faker.phone.phoneNumber(),
    joinDate: getDate(),
    merchantName,
    merchantId,
    createDate: getDate(),
    role: getRandomRole(),
    team: getRandomTeam(),
    contract: getRandomContract(),
    status: getRandomStatus(),
    expiryDate: getRandomExpiryDate(),
    balance: faker.datatype.number({ min: 10000000, max: 100000000 }),
    balance2: faker.datatype.number({ min: 10000000, max: 100000000 }),
    balance3: faker.datatype.number({ min: 10000000, max: 100000000 }),
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export function makeData(...lens: number[]): Employee[] {
  const makeDataLevel = (depth = 0): Employee[] => {
    const len = lens[depth];
    return range(len).map(() => ({
      ...newEmployee(),
      // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}
