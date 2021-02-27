import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ title, description });

    const surveyAlreadyExists = await surveysRepository.findOne({
      description,
    });

    if (surveyAlreadyExists) {
      throw new AppError("Pesquisa já existe!");
    }
    await surveysRepository.save(survey);

    return res.status(201).json(survey);
  }

  async show(req: Request, res: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return res.status(201).json(all);
  }

  async getSurvey(req: Request, res: Response) {
    const { id } = req.params;
    const repository = getCustomRepository(SurveysRepository);
    const survey = await repository.findOne({
      id,
    });

    if (!survey) throw new AppError("Pesquisa não encontrada!");

    return res.status(201).json(survey);
  }
}
export { SurveysController };
