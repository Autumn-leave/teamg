// src/controllers/UserController.ts
export {};
import { Request, Response } from "express";
import { TrainingRegisteredUser } from "../models/TrainingRegisteredUser";
import { User } from "../models/User";
const { Op } = require("sequelize");
import { trainingModel } from "../models/trainingModel";
const jwt = require("jsonwebtoken");

class TrainingController {

  private static async trainingExists(data: any) {
    try {
      const training:trainingModel|null = await trainingModel.findOne({
        where: { trainingId: data.trainingId },
      });
      if (training) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }

  public async createTraining(req: Request, res: Response) {
    const trainingData = req.body;
    try {
      await trainingModel.create(trainingData).then(() => {
        res.status(201).json({ message: "Training Created Successfully" });
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async getTrainingData(req: Request, res: Response) {
    const token = req.headers.authorization;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log("decodded", decoded.userExist);
          if (decoded.userExist) {
            const getData = await trainingModel.findAll({
              where: { is_active: true },
            });
            return res
              .status(200)
              .json({
                message: "successfully",
                trainingData: getData,
                userName: decoded.userExist.FirstName,
              });
          }
        }
      });
    } else {
      res.status(200).json({ message: "Token Not Found" });
    }
  }

  public async trainingRequest(req: Request, res: Response) {
    const token = req.headers.authorization;
    const trainingID = req.params.training;
    console.log(token);
    console.log(trainingID);
    try {
      if (token) {
        await jwt.verify(token, "naren", async (err: any, decoded: any) => {
          if (err) {
            if (err?.name === "TokenExpiredError") {
              res.status(200).json({ message: "TokenExpiredError" });
            }
            console.log(err);
          }
          if (decoded) {
            console.log("decodded", decoded.userExist);
            const user = decoded.userExist;
            if (user) {
              const training = await trainingModel.findOne({
                where: { trainingId: trainingID },
              });
              console.log("training", training?.dataValues);
              if (training?.dataValues) {
                const alreadyRegistered = await TrainingRegisteredUser.findOne({
                  where: {
                    [Op.and]: [
                      { Email: user.Employee_Email },
                      { trainingId: trainingID },
                    ],
                  },
                });
                if (alreadyRegistered?.dataValues) {
                  res.status(200).json({ message: "already exists" });
                } else {
                  const trainingCount = await TrainingRegisteredUser.count({
                    where: { trainingId: trainingID },
                  });
                  if (trainingCount >= training.dataValues.limit) {
                    res.status(200).json({ message: "Limit Reached" });
                  } else {
                    const info = {
                      Email: user.Employee_Email,
                      Firstname: user.FirstName,
                      Lastname: user.LastName,
                      trainingID: trainingID,
                      MobileNumber: user.Number,
                      RegisteredDateTime: new Date(),
                      is_disabled: true,
                    };
                    console.log("this is info : ", info);

                    await TrainingRegisteredUser.create(info).then(() => {
                      res.status(200).json({ message: "success" });
                    });
                  }
                }
              }
            }
          }
        });
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // delete training

  public async trainingDelete(req: Request, res: Response) {
    const token = req.headers.authorization;
    const trainingID = req.params.training;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log(decoded.userExist);
          const trainingExists = await trainingModel.findOne({
            where: { trainingId: trainingID },
          });
          if (trainingExists) {
            await trainingModel.update(
              { is_active: false },
              { where: { trainingId: trainingID } }
            );
            res.status(200).json({ message: "Deleted Successfully" });
          }
        }
      });
    }
  }

  //Edit button for training module
  public async editTrainingData(req:Request, res:Response){
    const token = req.headers.authorization;
    const trainingData = req.body;
    try{
      if(token){
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if(verifiedUser){
          await trainingModel.update(
            {trainingTitle: trainingData.trainingTitle,
              skillTitle: trainingData.skillTitle,
              skillCategory: trainingData.skillCategory,
              startDateTime: trainingData.startDateTime,
              endDateTime: trainingData.endDateTime,
              description: trainingData.description,
              limit: trainingData.limit,
              is_active: trainingData.is_active
            },
            { where: {trainingId: trainingData.trainingID}}
          );
          res.status(200).json({ message: "Updated Successfully" });

        }
        else{
          res.status(200).json({ message: "Unauthenticated USER" });
        }
      }
      else{
        res.status(200).json({ message: "Token not found!" });
      }
    }
    catch(error){
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

// token verification

  private static async verifyToken(token: string) {
    try {
      const result = await jwt.verify(token, "naren");

      if (result.error === "TokenExpiredError") {
        return "TokenExpiredError";
      }
      if (result.userExist) {
        return result.userExist;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Recycle bin

  public async recycleBin(req: Request, res: Response) {
    const token = req.headers.authorization;
    try {
      if (token) {
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if (verifiedUser) {
          const getData = await trainingModel.findAll({
            where: { is_active: false },
          });
          if (getData) {
            res
              .status(200)
              .json({ message: "successfully", trainingData: getData,userName: verifiedUser.FirstName, });
          } else {
            res.status(200).json({ message: "No Training Found" });
          }
        } else if (verifiedUser === "TokenExpiredError") {
          res.status(200).json({ message: "TokenExpiredError" });
        } else {
          res.status(200).json({ message: "Verification Failed" });
        }
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async dashboard(req: Request, res: Response) {
    const token = req.headers.authorization;
    try {
      if (token) {
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if (verifiedUser) {
          const getData = await TrainingRegisteredUser.findAll({
            where: { Email: verifiedUser.Employee_Email },
          });
          const trainings = await Promise.all(
            getData.map(async (data) => {
              const trainingId = await trainingModel.findOne({
                where: { trainingId: data.trainingTitle },
              });
              const obj = trainingId?.dataValues
              obj['RegisteredDateTime']= data.RegisteredDateTime
              return obj;
            })
          );
          if (getData) {
            res
              .status(200)
              .json({ message: "successfully", trainingData: trainings,userName:verifiedUser.FirstName });
          } else {
            res.status(200).json({ message: "No Training Found" });
          }
        } else if (verifiedUser === "TokenExpiredError") {
          res.status(200).json({ message: "TokenExpiredError" });
        } else {
          res.status(200).json({ message: "Verification Failed" });
        }
      } else {
        res.status(200).json({ message: "Token Not Found" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async restore(req:Request,res:Response){
    const token = req.headers.authorization;
    const trainingID = req.params.training;
    if (token) {
      await jwt.verify(token, "naren", async (err: any, decoded: any) => {
        if (err) {
          if (err?.name === "TokenExpiredError") {
            res.status(200).json({ message: "TokenExpiredError" });
          }
          console.log(err);
        }
        if (decoded) {
          console.log(decoded.userExist);
          const trainingExists = await trainingModel.findOne({
            where: { trainingId: trainingID },
          });
          if (trainingExists) {
            await trainingModel.update(
              { is_active: true },
              { where: { trainingId: trainingID } }
            );
            res.status(200).json({ message: "Restored Successfully" });
          }
        }
      });
    }
  }

  // geting user in admin dashboard

  public async getUser(req:Request, res:Response){
    const token = req.headers.authorization;
    try{
      if(token){
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if(verifiedUser){
          const getUser = await User.findAll({
            where: {is_admin: false},
          });
          return res
          .status(200)
          .json({
            message: "Successfully",
            userData: getUser,
          });
        }
        else{
          res.status(200).json({ message: "Unauthenticated USER" });
        }

      }
      else{
        res.status(200).json({ message: "Token Not Found" });
      }
    }
    catch(e){
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async userToAdmin(req:Request, res:Response){
    const token= req.headers.authorization;
    const userId = req.params.user
    try{
      if(token){
        const verifiedUser: any = await TrainingController.verifyToken(token);
        if(verifiedUser){
          const userExists = await User.findOne({
            where: { EMP_ID: userId },
          });
          if (userExists) {
            await User.update(
              { is_admin: true },
              { where: { EMP_ID: userId } }
            );
            res.status(200).json({ message: "User made as admin successfully" });
          }
        }
        else{
          res.status(200).json({ message: "unauthenticated user" });
        }
      }
      else{
        res.status(200).json({ message: "Token Not Found" });
      }
    }
    catch(error){
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

}

export const trainingController = new TrainingController();
