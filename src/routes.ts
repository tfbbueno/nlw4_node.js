import { Router } from "express";
import { AnswerController } from "./controller/AnswerController";
import { NpsController } from "./controller/NpsController";
import { SendMailController } from "./controller/SendMailController";
import { SurveysController } from "./controller/SurveysController";
import { UserController } from "./controller/UserController";

const router = Router();
const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);
router.get("/users", userController.show);
router.get("/users/:id", userController.getUser);

router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);
router.get("/surveys/:id", surveysController.getSurvey);

router.post("/sendMail", sendMailController.execute);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

export { router };
