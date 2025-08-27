import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Competitor pricing data
competitors = ['Tradify\n(Lite)', 'Powered Now\n(Business)', 'Workever\n(Base)', 'Tradify\n(Pro)', 'Powered Now\n(Premium)', 'Workever\n(Ultimate)', 'Joblogic\n(Standard)', 'ToolTime\n(Office)', 'BigChange\n(Job Mgmt)']
prices = [34, 27, 29, 37, 37, 39, 45, 54, 79.95]
colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#A23B72', '#F18F01', '#2E86AB', '#C73E1D', '#A23B72']

# Create the bar chart
plt.figure(figsize=(14, 8))
bars = plt.bar(competitors, prices, color=colors, alpha=0.8, edgecolor='black', linewidth=0.5)

# Customize the chart
plt.title('UK Trades Management Software - Monthly Pricing Comparison', fontsize=16, fontweight='bold', pad=20)
plt.xlabel('Competitors', fontsize=12, fontweight='bold')
plt.ylabel('Price (£ per user/month)', fontsize=12, fontweight='bold')
plt.xticks(rotation=45, ha='right')
plt.grid(axis='y', alpha=0.3, linestyle='--')

# Add value labels on bars
for bar, price in zip(bars, prices):
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 1,
             f'£{price}', ha='center', va='bottom', fontweight='bold', fontsize=10)

# Add price tiers
plt.axhspan(0, 35, alpha=0.1, color='green', label='Budget Tier (£27-34)')
plt.axhspan(35, 50, alpha=0.1, color='orange', label='Mid Tier (£35-50)')
plt.axhspan(50, 100, alpha=0.1, color='red', label='Premium Tier (£50+)')

plt.legend(loc='upper left')
plt.tight_layout()
plt.savefig('/home/ubuntu/pricing_comparison.png', dpi=300, bbox_inches='tight')
plt.close()

# Create feature comparison matrix
features = [
    'Job Scheduling', 'Customer Management', 'Quoting', 'Invoicing', 
    'Mobile App', 'Payment Processing', 'Accounting Integration',
    'Calendar Integration', 'GPS Tracking', 'Offline Mode', 
    'Customer Portal', 'Compliance Forms', 'Asset Management',
    'Route Optimization', 'AI Features'
]

competitors_short = ['Tradify', 'BigChange', 'Powered Now', 'ToolTime', 'ServiceM8', 'Joblogic', 'Workever', 'HouseCall Pro']

# Feature matrix (1 = has feature, 0.5 = partial, 0 = no feature)
feature_matrix = np.array([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 0.5, 0.5, 0.5, 1],  # Tradify
    [1, 1, 1, 1, 1, 1, 1, 0.5, 1, 0.5, 1, 1, 1, 1, 0],      # BigChange
    [1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 1, 1, 0.5, 0.5, 0], # Powered Now
    [1, 1, 1, 1, 1, 1, 1, 0.5, 1, 0.5, 0.5, 0.5, 0.5, 1, 0], # ToolTime
    [1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0], # ServiceM8
    [1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 0.5, 0],      # Joblogic
    [1, 1, 1, 1, 1, 1, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 0],  # Workever
    [1, 1, 1, 1, 1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 0] # HouseCall Pro
])

# Create heatmap
plt.figure(figsize=(12, 10))
im = plt.imshow(feature_matrix, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)

# Set ticks and labels
plt.xticks(range(len(features)), features, rotation=45, ha='right')
plt.yticks(range(len(competitors_short)), competitors_short)

# Add text annotations
for i in range(len(competitors_short)):
    for j in range(len(features)):
        value = feature_matrix[i, j]
        if value == 1:
            text = '✓'
            color = 'white'
        elif value == 0.5:
            text = '◐'
            color = 'black'
        else:
            text = '✗'
            color = 'white'
        plt.text(j, i, text, ha='center', va='center', color=color, fontsize=12, fontweight='bold')

plt.title('Feature Comparison Matrix - UK Trades Management Software', fontsize=14, fontweight='bold', pad=20)
plt.colorbar(im, label='Feature Availability', shrink=0.8)

# Add legend
legend_elements = [
    plt.Rectangle((0,0),1,1, facecolor='#2E7D32', label='Full Feature'),
    plt.Rectangle((0,0),1,1, facecolor='#FFA000', label='Partial Feature'),
    plt.Rectangle((0,0),1,1, facecolor='#C62828', label='No Feature')
]
plt.legend(handles=legend_elements, loc='upper left', bbox_to_anchor=(1.05, 1))

plt.tight_layout()
plt.savefig('/home/ubuntu/feature_comparison_matrix.png', dpi=300, bbox_inches='tight')
plt.close()

print("Visualizations created successfully!")
print("- pricing_comparison.png")
print("- feature_comparison_matrix.png")

