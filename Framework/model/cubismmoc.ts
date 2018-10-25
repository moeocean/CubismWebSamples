﻿/*
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as cubismmodel} from "./cubismmodel";
import CubismModel = cubismmodel.CubismModel;
import { CSM_ASSERT } from "../utils/cubismdebug";

export namespace Live2DCubismFramework
{
    /**
     * Mocデータの管理
     * 
     * Mocデータの管理を行うクラス。
     */
    export class CubismMoc
    {
        /**
         * Mocデータの作成
         */
        public static create(mocBytes: ArrayBuffer): CubismMoc
        {
            let cubismMoc: CubismMoc = null;
            let moc: Live2DCubismCore.Moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);

            if (moc)
            {
                cubismMoc = new CubismMoc(moc);
            }

            return cubismMoc;
        }

        /**
         * Mocデータを削除
         * 
         * Mocデータを削除する
         */
        public static delete(moc: CubismMoc): void
        {
            moc._moc._release();
            moc._moc = null;
            moc = null;
        }
        
        /**
         * モデルを作成する
         * 
         * @return Mocデータから作成されたモデル
         */
        createModel(): CubismModel
        {
             let cubismModel: CubismModel = null;

             let model: Live2DCubismCore.Model = Live2DCubismCore.Model.fromMoc(this._moc);

             if (model)
             {
                cubismModel = new CubismModel(model);
                cubismModel.initialize();

                ++this._modelCount;
             }

             return cubismModel;
        }

        /**
         * モデルを削除する
         */
        deleteModel(model: CubismModel): void
        {
            if(model != null)
            {
                model.release();
                model = null;
                --this._modelCount;
            }
        }


        /**
         * コンストラクタ
         */
        private constructor(moc: Live2DCubismCore.Moc)
        {
            this._moc = moc;
            this._modelCount = 0;
        }

        /**
         * デストラクタ相当の処理
         */
        public release(): void
        {
            CSM_ASSERT(this._modelCount == 0);

            this._moc._release();
            this._moc = null;
        }

        _moc: Live2DCubismCore.Moc; ///< Mocデータ
        _modelCount: number;        ///< Mocデータから作られたモデルの個数
    }
}