import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    );

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    );

    const passives = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    );

    const calculate = Number(
      (
        ((promoters.length - detractors.length) / surveysUsers.length) *
        100
      ).toFixed(2)
    );

    return res.json({
      detractors,
      promoters,
      passives,
      totalAnswers: surveysUsers.length,
      nps: calculate,
    });
  }
}
export { NpsController };
