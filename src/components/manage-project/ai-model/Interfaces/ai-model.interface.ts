import { Document } from 'mongoose';

export interface IAiModel extends Document {
    expNo: string;
    experimentBcHash: string;
    updatedAt: Date;
    createdAt: Date;
    version: string;
    project: string;
}

export interface IAiModelExp {
    exp: IExp;
}

export interface IExp {
    exp_no: string;
    datetime: string;
    hyperparameters: IHyperParameters;
    epochs: { [key: string]: IEpochs };
    test_metrics: ITestMetrics;
}

export interface IHyperParameters {
    hidden_size: string;
    learning_rate: string;
    data_dir: string;
}

export interface IEpochs {
    val_accuracy: string;
    train_loss: string;
    val_loss: string;
    train_f1_score: string;
    train_recall: string;
    train_acc: string;
    train_precision: string;
}

export interface ITestMetrics {
    test_f1_score: string;
    test_accuracy: string;
    test_recall: string;
    test_precision: string;
    test_loss: string;
}
