import { NbMenuItem } from "@nebular/theme";

const userdata = localStorage.getItem("userDetails");
let userData: any;
let role;
if (userdata) {
  userData = JSON.parse(userdata);
  role = userData.Role;
} else {
  if (role == undefined) {
    role = "";
  } else {
    role = userData.Role;
  }
}
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "grid-outline",
    link: "/pages/dashboard",
    home: true,
  },
  {
    title: "Channel Partner",
    icon: "monitor-outline",
    link: "/pages/channel-partner",
  },
];

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Masters",
    icon: "lock-outline",

    children: [
      {
        title: "Dashboard",
        icon: "grid-outline",
        link: "/admin/dashboard",
        home: true,
      },
      {
        title: "User Maintenance",
        icon: "person-outline",
        link: "/admin/users",
        home: true,
      },
      {
        title: "Territory-Master",
        icon: "pin-outline",
        link: "/admin/territory-master",
      },
      {
        title: "Approval Delegation",
        link: "/admin/approval-delegation",
        icon: "person-done-outline",
      },
      {
        title: "Master Data Maintenance",
        icon: "folder-outline",
        link: "/admin/master-data-management",
      },
      {
        title: "Email Setting",
        icon: "email-outline",
        link: "/admin/email-setting",
      },
    ],
  },
];

export const INITIATOR_MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "grid-outline",
    link: "/pages/dashboard",
    home: true,
  },
  {
    title: "Channel Partner",
    icon: "monitor-outline",
    link: "/pages/channel-partner",
  },
  {
    title: "Initiator",
    icon: "monitor-outline",
    link: "/pages/initiator-screen",
  },
];
