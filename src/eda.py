"""
Exploratory Data Analysis (EDA) module for visualization and insights.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import logging
from typing import List
from src.utils import REPORTS_DIR, TARGET_COLUMN

logger = logging.getLogger(__name__)

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)


class EDA:
    """Perform exploratory data analysis and generate visualizations."""
    
    def __init__(self, data: pd.DataFrame, output_dir: str = REPORTS_DIR):
        """Initialize with dataframe and output directory."""
        self.data = data
        self.output_dir = output_dir
        self.figures_created = []
    
    def plot_target_distribution(self, filename: str = '01_target_distribution.png') -> str:
        """Plot target variable distribution."""
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        
        # Count plot
        target_counts = self.data[TARGET_COLUMN].value_counts()
        colors = ['#2ecc71', '#e74c3c']
        axes[0].bar(target_counts.index, target_counts.values, color=colors)
        axes[0].set_title(f'{TARGET_COLUMN} Distribution', fontsize=14, fontweight='bold')
        axes[0].set_xlabel('Risk Level')
        axes[0].set_ylabel('Count')
        
        # Percentage
        target_pcts = self.data[TARGET_COLUMN].value_counts(normalize=True) * 100
        axes[1].pie(target_pcts.values, labels=[f'Class {i}: {pct:.1f}%' for i, pct in enumerate(target_pcts.values)],
                   colors=colors, autopct='%1.1f%%', startangle=90)
        axes[1].set_title('Class Distribution', fontsize=14, fontweight='bold')
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        self.figures_created.append(filepath)
        logger.info(f"Saved target distribution plot to {filepath}")
        return filepath
    
    def plot_correlation_heatmap(self, filename: str = '02_correlation_heatmap.png') -> str:
        """Plot correlation heatmap of numeric features."""
        numeric_data = self.data.select_dtypes(include=[np.number])
        
        if len(numeric_data.columns) < 2:
            logger.warning("Insufficient numeric features for correlation heatmap")
            return ""
        
        fig, ax = plt.subplots(figsize=(14, 10))
        corr_matrix = numeric_data.corr()
        
        sns.heatmap(corr_matrix, annot=False, cmap='coolwarm', center=0,
                   square=True, linewidths=0.5, cbar_kws={"shrink": 0.8}, ax=ax)
        ax.set_title('Feature Correlation Matrix', fontsize=14, fontweight='bold')
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        self.figures_created.append(filepath)
        logger.info(f"Saved correlation heatmap to {filepath}")
        return filepath
    
    def plot_numeric_distributions(self, filename: str = '03_numeric_distributions.png') -> str:
        """Plot distributions of numeric features."""
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != TARGET_COLUMN][:6]  # Limit to 6
        
        if not numeric_cols:
            logger.warning("No numeric features to plot")
            return ""
        
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        axes = axes.flatten()
        
        for idx, col in enumerate(numeric_cols):
            axes[idx].hist(self.data[col], bins=30, edgecolor='black', alpha=0.7, color='skyblue')
            axes[idx].set_title(f'Distribution of {col}', fontweight='bold')
            axes[idx].set_xlabel(col)
            axes[idx].set_ylabel('Frequency')
        
        # Hide unused subplots
        for idx in range(len(numeric_cols), len(axes)):
            axes[idx].set_visible(False)
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        self.figures_created.append(filepath)
        logger.info(f"Saved numeric distributions to {filepath}")
        return filepath
    
    def plot_missing_values(self, filename: str = '04_missing_values.png') -> str:
        """Plot missing values analysis."""
        missing_data = self.data.isnull().sum()
        missing_data = missing_data[missing_data > 0]
        
        if len(missing_data) == 0:
            logger.info("No missing values to plot")
            return ""
        
        fig, ax = plt.subplots(figsize=(12, 6))
        missing_data.sort_values(ascending=False).plot(kind='barh', ax=ax, color='coral')
        ax.set_title('Missing Values Count', fontsize=14, fontweight='bold')
        ax.set_xlabel('Number of Missing Values')
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        self.figures_created.append(filepath)
        logger.info(f"Saved missing values plot to {filepath}")
        return filepath
    
    def plot_target_by_feature(self, filename: str = '05_target_by_feature.png') -> str:
        """Plot target variable by key features."""
        numeric_cols = self.data.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [col for col in numeric_cols if col != TARGET_COLUMN][:3]
        
        if not numeric_cols:
            logger.warning("No numeric features for target analysis")
            return ""
        
        fig, axes = plt.subplots(1, len(numeric_cols), figsize=(15, 5))
        if len(numeric_cols) == 1:
            axes = [axes]
        
        for idx, col in enumerate(numeric_cols):
            self.data.groupby(TARGET_COLUMN)[col].mean().plot(kind='bar', ax=axes[idx], color=['green', 'red'])
            axes[idx].set_title(f'Average {col} by {TARGET_COLUMN}', fontweight='bold')
            axes[idx].set_ylabel(f'Average {col}')
        
        filepath = f"{self.output_dir}/{filename}"
        plt.tight_layout()
        plt.savefig(filepath, dpi=300, bbox_inches='tight')
        plt.close()
        
        self.figures_created.append(filepath)
        logger.info(f"Saved target by feature plot to {filepath}")
        return filepath
    
    def generate_summary_statistics(self, filename: str = '06_summary_statistics.txt') -> str:
        """Generate summary statistics report."""
        report = []
        report.append("=" * 80)
        report.append("EXPLORATORY DATA ANALYSIS SUMMARY")
        report.append("=" * 80)
        report.append("")
        
        # Dataset Overview
        report.append("DATASET OVERVIEW")
        report.append("-" * 80)
        report.append(f"Total Records: {len(self.data)}")
        report.append(f"Total Features: {len(self.data.columns)}")
        report.append(f"Memory Usage: {self.data.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
        report.append("")
        
        # Target Distribution
        report.append("TARGET DISTRIBUTION")
        report.append("-" * 80)
        for target, count in self.data[TARGET_COLUMN].value_counts().items():
            pct = (count / len(self.data)) * 100
            report.append(f"Class {target}: {count} ({pct:.2f}%)")
        report.append("")
        
        # Numeric Features Summary
        report.append("NUMERIC FEATURES SUMMARY")
        report.append("-" * 80)
        numeric_summary = self.data.describe()
        report.append(numeric_summary.to_string())
        report.append("")
        
        # Missing Values
        report.append("MISSING VALUES")
        report.append("-" * 80)
        missing = self.data.isnull().sum()
        if missing.sum() == 0:
            report.append("No missing values found")
        else:
            for col, count in missing[missing > 0].items():
                pct = (count / len(self.data)) * 100
                report.append(f"{col}: {count} ({pct:.2f}%)")
        report.append("")
        
        # Categorical Features
        report.append("CATEGORICAL FEATURES")
        report.append("-" * 80)
        categorical_cols = self.data.select_dtypes(include=['object']).columns.tolist()
        if categorical_cols:
            for col in categorical_cols:
                report.append(f"\n{col}:")
                report.append(self.data[col].value_counts().to_string())
        else:
            report.append("No categorical features found")
        
        report_text = "\n".join(report)
        filepath = f"{self.output_dir}/{filename}"
        
        with open(filepath, 'w') as f:
            f.write(report_text)
        
        logger.info(f"Saved summary statistics to {filepath}")
        return filepath
    
    def run_all_analyses(self) -> List[str]:
        """Run all EDA analyses."""
        logger.info("Starting EDA pipeline...")
        self.plot_target_distribution()
        self.plot_correlation_heatmap()
        self.plot_numeric_distributions()
        self.plot_missing_values()
        self.plot_target_by_feature()
        self.generate_summary_statistics()
        logger.info(f"EDA completed. Generated {len(self.figures_created)} outputs")
        return self.figures_created


def generate_eda_report(data: pd.DataFrame) -> List[str]:
    """Convenience function to generate complete EDA report."""
    eda = EDA(data)
    return eda.run_all_analyses()
