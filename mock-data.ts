import {FixtureDataModel} from './src/models/fixtures';
import {LeagueDataModel, LeagueDataSeasonsModel} from './src/models/leagues';

export const favLeagues: LeagueDataModel[] = [
  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 39,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),

  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 78,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),

  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 144,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),

  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 218,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),

  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 61,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),

  new LeagueDataModel({
    country: {
      code: 'ABC',
      flag: 'NONE',
      name: 'Italy',
    },
    league: {
      id: 125,
      logo: 'er',
      name: 'Serie a',
      type: 'any',
      selected: 'false',
    },
    seasons: [
      new LeagueDataSeasonsModel({
        current: false,
        end: '12/11/2022',
        start: '12/11/2021',
        year: 2022,
      }),
    ],
  }),
];

export const goupedFixtures: {
  fixtures: FixtureDataModel[];
  option: {
    name: String;
    id: number;
    level: number;
    shortName: String;
    description: string;
  };
}[] = [
  {
    fixtures: [
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874879,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874877,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874878,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
    ],
    option: {
      id: 3,
      level: 3,
      description: 'Both teams to score',
      name: 'BTTS',
      shortName: 'BTTS',
    },
  },
  {
    fixtures: [
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874879,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874877,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874878,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
    ],
    option: {
      id: 22,
      level: 3,
      description: 'Home Team wins',
      name: 'BTTS',
      shortName: 'BTTS',
    },
  },
  {
    fixtures: [
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874879,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874877,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
      new FixtureDataModel({
        fixture: {
          date: '2022-11-12T15:00:00+00:00',
          id: 874878,
          timezone: 'UTC',
          status: {long: 'Not Started', short: 'NS', elapsed: 0},
          timestamp: 166826520,
        },
        goals: {home: 0, away: 0},
        league: {
          country: 'Belgium',
          // flag: 'https://media.api-sports.io/flags/be.svg',
          id: 144,
          logo: 'https://media.api-sports.io/football/leagues/144.png',
          name: 'Jupiler Pro League',
          // round: 'Regular Season - 17',
          season: 2022,
        },
        score: {
          extratime: {home: 0, away: 0},
          fulltime: {home: 0, away: 0},
          halftime: {home: 0, away: 0},
        },
        teams: {
          away: {
            id: 624,
            logo: 'https://media.api-sports.io/football/teams/624.png',
            name: 'Oostende',
            winner: true,
          },
          home: {
            id: 261,
            name: 'KVC Westerlo',
            logo: 'https://media.api-sports.io/football/teams/261.png',
            winner: false,
          },
        },
      }),
    ],
    option: {
      id: 4,
      level: 3,
      description: 'Over 3.5',
      name: 'BTTS',
      shortName: 'BTTS',
    },
  },
];
