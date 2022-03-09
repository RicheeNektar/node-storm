const { days } = require("./config");

const formatMenuItem = (item) =>
  item.type === "message"
    ? [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `* ${item.title}*\n      _${item.message}_`,
          },
        },
      ]
    : [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `* ${item.title}*\n      _${item.garnish.join(" ")}_`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: `${item.price.toFixed(2).replace(/\./, ", ")} €`,
            },
          },
        },
        {
          type: "divider",
        },
      ];

const formatItems = (items) => {
  const arr = [];
  items.forEach((item) => arr.push(...formatMenuItem(item)));
  return arr;
};

module.exports = (date, items) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();

  const monthStr = `${month < 10 ? "0" : ""}${month}`;
  const dayStr = `${day < 10 ? "0" : ""}${day}`;

  return [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: `Menü für ${days[date.getDay()]}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "divider",
    },
    ...formatItems(items),
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: "* Vegetarisch",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: `vom ${dayStr}.${monthStr}.${year}`,
        },
      ],
    },
  ];
};
