import { TypeImage } from "@/types";

export const maxWidth = "sm";
export const initialHP = 100;

export const images: TypeImage[] = [
  { url: "images/gu.png", hand: "gu" },
  { url: "images/choki.png", hand: "choki" },
  { url: "images/pa.png", hand: "pa" },
];

export const locales = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
};
export const defaultLocale = "en";
export const defaultLocaleData = {
  locale: defaultLocale,
  Home: {
    title: "",
    titleMessage: "",
  },
  ModeSelect: {
    title: "",
    labelLevelSelect: "",
    labelPlayerLobby: "",
  },
  LevelSelect: {
    level: "",
  },
  ModalContent: {
    comment: "",
    viewDetailsButton: "",
    confirmButton: "",
  },
  ConfirmSilhouette: {
    retakeButton: "",
    confirmButton: "",
    message: "",
  },
  NamingMonster: {
    message: "",
    monsterName: "",
    next: "",
  },
  SelectSilhouette: {
    message: "",
    backButton: "",
    nextButton: "",
  },
  Field: {
    message: "",
  },
  CreateRoom: {
    message: "",
  },
  EnterRoom: {
    message: "",
    confirmButton: "",
    errorMessage: "",
  },
  BattleResult: {
    titleWinner: "",
    titleLoser: "",
    messageWinner: "",
    messageLoser: "",
    touchMassage: "",
  },
  Swiper: {
    message: "",
    makeMonster: "",
  },
  PlayerLobby: {
    title: "",
    createRoom: "",
    enterRoom: "",
  },
  BattleAttackSelect: {
    errorMessage: "",
    startMessage: "",
    buttonSelectMessage: "",
    battleCry: "",
    succsessfulMessage: "",
    drawMessage: "",
    failedMessage: "",
  },
  TakePicture: {
    errorMessage1: "",
    errorMessage2: "",
    infoMessage: "",
    loadingMessage: "",
    reloadMessage: "",
  },
};
