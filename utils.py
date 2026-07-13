"""
SaccArbor - Utility Module
"""

import os
import joblib
import pandas as pd
import numpy as np


def load_data(file_path: str) -> pd.DataFrame:
    """
    Loads the diabetes dataset and validates structure.
    
    Args:
        file_path: Path to the CSV file.
        
    Returns:
        Loaded pandas DataFrame.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found at: {file_path}")
        
    df = pd.read_csv(file_path)
    
    expected_cols = [
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome'
    ]
    
    for col in expected_cols:
        if col not in df.columns:
            raise ValueError(f"Dataset is missing required feature: {col}")
            
    print(f"Dataset loaded: {df.shape[0]} patients, {df.shape[1]} variables.")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans physiological variables. Zero values in Glucose, BloodPressure,
    SkinThickness, Insulin, and BMI represent missing data and are imputed
    using class-wise medians.
    
    Args:
        df: Raw dataset.
        
    Returns:
        Imputed dataset with no invalid zeroes.
    """
    df_cleaned = df.copy()
    zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    
    for col in zero_cols:
        df_cleaned[col] = df_cleaned[col].astype(float)
    
    print("Imputing missing values...")
    for col in zero_cols:
        medians = df_cleaned[df_cleaned[col] > 0].groupby('Outcome')[col].median()
        zeros_count = (df_cleaned[col] == 0).sum()
        
        df_cleaned.loc[(df_cleaned[col] == 0) & (df_cleaned['Outcome'] == 0), col] = medians[0]
        df_cleaned.loc[(df_cleaned[col] == 0) & (df_cleaned['Outcome'] == 1), col] = medians[1]
        
        print(f"  Imputed {zeros_count} zeros in '{col}'.")
        
    return df_cleaned


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    """
    Creates interaction terms and binning for enhanced model learning.
    
    Features:
    - Glucose_Age_Interaction: Metabolic decline combined with glucose
    - BMI_Insulin_Ratio: Insulin resistance marker
    - Age_Group: Epidemiological risk binning
    
    Args:
        df: Cleaned dataset.
        
    Returns:
        Dataset with engineered features.
    """
    df_feat = df.copy()
    
    df_feat['Glucose_Age_Interaction'] = df_feat['Glucose'] * df_feat['Age']
    df_feat['BMI_Insulin_Ratio'] = df_feat['BMI'] / (df_feat['Insulin'] + 0.1)
    
    bins = [20, 30, 45, 60, 100]
    labels = [0, 1, 2, 3]
    df_feat['Age_Group'] = pd.cut(df_feat['Age'], bins=bins, labels=labels).astype(int)
    
    print("Feature engineering complete.")
    print("  Added: Glucose_Age_Interaction, BMI_Insulin_Ratio, Age_Group")
    
    return df_feat


def save_artifact(obj, file_path: str) -> None:
    """
    Saves an object to disk using joblib.
    """
    directory = os.path.dirname(file_path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    joblib.dump(obj, file_path)
    print(f"Saved artifact to: {file_path}")


def load_artifact(file_path: str):
    """
    Loads an object from disk using joblib.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Artifact not found at: {file_path}")
    return joblib.load(file_path)
