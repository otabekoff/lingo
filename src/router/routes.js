import Buttons from "@/pages/Buttons.vue";
import About from "@/pages/About.vue";
import SignIn from "@/pages/SignIn.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    children: [
      {
        path: "", // No need to specify "/" here
        name: "HomePage",
        component: () => import("@/pages/Home.vue"),
      },
      {
        path: "buttons", // Relative path
        name: "ButtonsPage",
        component: Buttons,
      },
    ],
  },
  {
    path: "/about", // Direct path for About page
    component: () => import("@/layouts/FooterlessLayout.vue"),
    children: [
      {
        path: "", // No need to specify "/" here
        name: "About",
        component: About,
      },
      {
        path: "newabout", // Relative path
        name: "NewAbout",
        component: About,
      },
    ],
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/ErrorNotFound.vue"),
  },
];

export default routes;
