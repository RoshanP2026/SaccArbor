"""
SaccArbor - Model Training Pipeline
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report, confusion_matrix

import utils

# Path Configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "diabetes.csv")
MODEL_OUT = os.path.join(BASE_DIR, "model.pkl")
SCALER_OUT = os.path.join(BASE_DIR, "scaler.pkl")


def run_pipeline():
    print("=" * 60)
    print("SaccArbor Training Pipeline")
    print("=" * 60)
    
    df = utils.load_data(DATA_PATH)
    df_cleaned = utils.clean_data(df)
    df_features = utils.feature_engineering(df_cleaned)
    
    X = df_features.drop(columns=['Outcome'])
    y = df_features['Outcome']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"\nTrain-test split complete:")
    print(f"  - Training: {X_train.shape[0]} patients")
    print(f"  - Test: {X_test.shape[0]} patients")
    
    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    
    scale_features = [
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 
        'Glucose_Age_Interaction', 'BMI_Insulin_Ratio'
    ]
    
    X_train_scaled[scale_features] = scaler.fit_transform(X_train[scale_features])
    X_test_scaled[scale_features] = scaler.transform(X_test[scale_features])
    print(f"\nScaling complete.")
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "Random Forest (Baseline)": RandomForestClassifier(n_estimators=100, random_state=42),
        "Support Vector Machine": SVC(probability=True, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    results = {}
    print("\nTraining models...")
    
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_test_scaled)
        probs = model.predict_proba(X_test_scaled)[:, 1]
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds)
        f1 = f1_score(y_test, preds)
        auc = roc_auc_score(y_test, probs)
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='accuracy')
        
        results[name] = {
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1,
            "ROC-AUC": auc,
            "CV Mean Accuracy": cv_scores.mean()
        }
        
        print(f"  - {name:<26} -> Test Acc: {acc:.3f} | CV Mean Acc: {cv_scores.mean():.3f} | F1: {f1:.3f}")

    print("\nTuning Random Forest hyperparameters...")
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [4, 6, 8, 10],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True]
    }
    
    rf_base = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(
        estimator=rf_base, 
        param_grid=param_grid, 
        cv=5, 
        scoring='accuracy', 
        n_jobs=-1, 
        verbose=0
    )
    grid_search.fit(X_train_scaled, y_train)
    
    best_rf = grid_search.best_estimator_
    print(f"  Optimal Hyperparameters: {grid_search.best_params_}")
    
    tuned_preds = best_rf.predict(X_test_scaled)
    tuned_probs = best_rf.predict_proba(X_test_scaled)[:, 1]
    
    tuned_acc = accuracy_score(y_test, tuned_preds)
    tuned_prec = precision_score(y_test, tuned_preds)
    tuned_rec = recall_score(y_test, tuned_preds)
    tuned_f1 = f1_score(y_test, tuned_preds)
    tuned_auc = roc_auc_score(y_test, tuned_probs)
    tuned_cv = cross_val_score(best_rf, X_train_scaled, y_train, cv=5, scoring='accuracy').mean()
    
    results["Random Forest (Tuned)"] = {
        "Accuracy": tuned_acc,
        "Precision": tuned_prec,
        "Recall": tuned_rec,
        "F1 Score": tuned_f1,
        "ROC-AUC": tuned_auc,
        "CV Mean Accuracy": tuned_cv
    }
    
    print(f"  Random Forest (Tuned)   -> Test Acc: {tuned_acc:.3f} | CV Mean Acc: {tuned_cv:.3f} | F1: {tuned_f1:.3f}")
    
    comparison_df = pd.DataFrame(results).T
    print("\nPerformance comparison:")
    print("-" * 80)
    print(comparison_df.round(4).to_string())
    print("-" * 80)
    
    best_model_name = comparison_df['F1 Score'].idxmax()
    print(f"\nBest model by F1 score: {best_model_name}")
    
    if best_model_name == "Random Forest (Tuned)":
        optimal_model = best_rf
    elif best_model_name == "Gradient Boosting":
        optimal_model = models["Gradient Boosting"]
    elif best_model_name == "Support Vector Machine":
        optimal_model = models["Support Vector Machine"]
    elif best_model_name == "Logistic Regression":
        optimal_model = models["Logistic Regression"]
    elif best_model_name == "Decision Tree":
        optimal_model = models["Decision Tree"]
    else:
        optimal_model = models["Random Forest (Baseline)"]
        
    print("\nSaving artifacts...")
    utils.save_artifact(optimal_model, MODEL_OUT)
    utils.save_artifact(scaler, SCALER_OUT)
    print("Model and scaler saved.")


if __name__ == "__main__":
    run_pipeline()
