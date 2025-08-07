const axios = require('axios');

/**
 * Healthcare Research Integration Service
 * Integrates with medical databases and research sources
 */
class HealthcareResearchService {
    constructor() {
        this.pubmedBaseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
        this.fhirBaseUrl = 'http://hapi.fhir.org/baseR4';
        this.clinicalTrialsUrl = 'https://clinicaltrials.gov/api';

        // Medical knowledge databases
        this.medicalDatabases = {
            pubmed: 'PubMed/MEDLINE',
            cochrane: 'Cochrane Library',
            uptodate: 'UpToDate',
            clinicalTrials: 'ClinicalTrials.gov',
            fhir: 'FHIR Resources',
            icd10: 'ICD-10 Codes',
            snomed: 'SNOMED CT',
            rxnorm: 'RxNorm',
            loinc: 'LOINC'
        };

        // Clinical decision support tools
        this.clinicalTools = {
            diagnosticCriteria: 'Diagnostic Criteria Database',
            treatmentGuidelines: 'Treatment Guidelines',
            drugInteractions: 'Drug Interaction Checker',
            calculators: 'Medical Calculators',
            protocols: 'Clinical Protocols'
        };
    }

    /**
     * Search PubMed for medical literature
     */
    async searchPubMed(query, options = {}) {
        try {
            const searchParams = {
                db: 'pubmed',
                term: query,
                retmax: options.limit || 10,
                retmode: 'json',
                usehistory: 'y',
                sort: options.sort || 'relevance'
            };

            // Search PubMed
            const searchResponse = await axios.get(`${this.pubmedBaseUrl}/esearch.fcgi`, {
                params: searchParams
            });

            if (!searchResponse.data.esearchresult.idlist?.length) {
                return [];
            }

            const ids = searchResponse.data.esearchresult.idlist;

            // Fetch detailed information
            const summaryResponse = await axios.get(`${this.pubmedBaseUrl}/esummary.fcgi`, {
                params: {
                    db: 'pubmed',
                    id: ids.join(','),
                    retmode: 'json'
                }
            });

            const results = Object.values(summaryResponse.data.result).filter(item => item.uid);

            return results.map(article => ({
                id: article.uid,
                title: article.title,
                authors: article.authors?.map(author => author.name).join(', ') || 'Unknown',
                journal: article.source,
                publishDate: article.pubdate,
                abstract: article.summary || '',
                pmid: article.uid,
                url: `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`,
                relevanceScore: this.calculateRelevance(article, query),
                source: 'PubMed'
            }));
        } catch (error) {
            console.error('PubMed search error:', error);
            return [];
        }
    }

    /**
     * Search clinical trials
     */
    async searchClinicalTrials(condition, options = {}) {
        try {
            const searchParams = {
                'query.cond': condition,
                'query.recrs': 'a,f,d', // Active, recruiting, completed
                'min_rnk': 1,
                'max_rnk': options.limit || 10,
                'fmt': 'json'
            };

            const response = await axios.get(`${this.clinicalTrialsUrl}/query/study_fields`, {
                params: {
                    ...searchParams,
                    fields: 'NCTId,BriefTitle,Condition,Phase,OverallStatus,StartDate,CompletionDate,StudyType'
                }
            });

            return response.data.StudyFieldsResponse.StudyFields.map(trial => ({
                nctId: trial.NCTId[0],
                title: trial.BriefTitle[0],
                condition: trial.Condition.join(', '),
                phase: trial.Phase.join(', '),
                status: trial.OverallStatus[0],
                startDate: trial.StartDate[0],
                completionDate: trial.CompletionDate[0],
                studyType: trial.StudyType[0],
                url: `https://clinicaltrials.gov/ct2/show/${trial.NCTId[0]}`,
                source: 'ClinicalTrials.gov'
            }));
        } catch (error) {
            console.error('Clinical trials search error:', error);
            return [];
        }
    }

    /**
     * Get diagnostic criteria for a condition
     */
    async getDiagnosticCriteria(condition) {
        // Mock implementation - would integrate with medical knowledge bases
        const diagnosticCriteria = {
            'diabetes': {
                criteria: [
                    'Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)',
                    'Random plasma glucose ≥200 mg/dL (11.1 mmol/L) with symptoms',
                    'HbA1c ≥6.5% (48 mmol/mol)',
                    '2-hour plasma glucose ≥200 mg/dL during OGTT'
                ],
                source: 'American Diabetes Association',
                lastUpdated: '2023',
                url: 'https://care.diabetesjournals.org/'
            },
            'hypertension': {
                criteria: [
                    'Systolic BP ≥130 mmHg or Diastolic BP ≥80 mmHg',
                    'Confirmed on multiple occasions',
                    'Exclude white coat hypertension',
                    'Consider ambulatory BP monitoring'
                ],
                source: 'ACC/AHA Guidelines',
                lastUpdated: '2023',
                url: 'https://www.ahajournals.org/'
            }
        };

        return diagnosticCriteria[condition.toLowerCase()] || null;
    }

    /**
     * Get treatment guidelines
     */
    async getTreatmentGuidelines(condition, patientContext = {}) {
        try {
            // Mock implementation - would integrate with medical societies' guidelines
            const guidelines = {
                'diabetes type 2': {
                    firstLine: [
                        'Metformin 500-1000mg twice daily',
                        'Lifestyle modifications (diet, exercise)',
                        'Patient education and self-monitoring'
                    ],
                    secondLine: [
                        'Add SGLT-2 inhibitor if cardiovascular disease',
                        'Add GLP-1 agonist if obesity',
                        'Add sulfonylurea if cost is concern'
                    ],
                    monitoring: [
                        'HbA1c every 3-6 months',
                        'Annual comprehensive metabolic panel',
                        'Annual eye and foot examination',
                        'Annual lipid profile'
                    ],
                    source: 'American Diabetes Association',
                    strength: 'Strong recommendation',
                    evidenceLevel: 'A'
                }
            };

            return guidelines[condition.toLowerCase()] || null;
        } catch (error) {
            console.error('Treatment guidelines error:', error);
            return null;
        }
    }

    /**
     * Check drug interactions
     */
    async checkDrugInteractions(medications) {
        try {
            // Mock implementation - would integrate with drug interaction databases
            const interactions = [];

            // Simple interaction checker logic
            const interactionPairs = {
                'warfarin': ['aspirin', 'ibuprofen', 'fluconazole'],
                'digoxin': ['furosemide', 'verapamil', 'quinidine'],
                'lithium': ['nsaids', 'ace inhibitors', 'thiazides']
            };

            for (let i = 0; i < medications.length; i++) {
                for (let j = i + 1; j < medications.length; j++) {
                    const med1 = medications[i].toLowerCase();
                    const med2 = medications[j].toLowerCase();

                    if (interactionPairs[med1]?.includes(med2) || interactionPairs[med2]?.includes(med1)) {
                        interactions.push({
                            drug1: medications[i],
                            drug2: medications[j],
                            severity: 'moderate',
                            description: `Potential interaction between ${medications[i]} and ${medications[j]}`,
                            recommendation: 'Monitor closely and consider dose adjustment'
                        });
                    }
                }
            }

            return interactions;
        } catch (error) {
            console.error('Drug interaction check error:', error);
            return [];
        }
    }

    /**
     * Get ICD-10 codes for a condition
     */
    async getICD10Codes(condition) {
        try {
            // Mock implementation - would integrate with ICD-10 API
            const icdCodes = {
                'diabetes type 2': {
                    primary: 'E11.9',
                    description: 'Type 2 diabetes mellitus without complications',
                    alternatives: [
                        { code: 'E11.0', description: 'Type 2 diabetes mellitus with hyperosmolarity' },
                        { code: 'E11.1', description: 'Type 2 diabetes mellitus with ketoacidosis' },
                        { code: 'E11.2', description: 'Type 2 diabetes mellitus with kidney complications' }
                    ]
                },
                'hypertension': {
                    primary: 'I10',
                    description: 'Essential (primary) hypertension',
                    alternatives: [
                        { code: 'I11.0', description: 'Hypertensive heart disease with heart failure' },
                        { code: 'I12.0', description: 'Hypertensive chronic kidney disease with stage 5 chronic kidney disease' }
                    ]
                }
            };

            return icdCodes[condition.toLowerCase()] || null;
        } catch (error) {
            console.error('ICD-10 codes error:', error);
            return null;
        }
    }

    /**
     * Get medical calculators relevant to a condition
     */
    async getMedicalCalculators(condition, patientData = {}) {
        try {
            const calculators = {
                'cardiovascular': [
                    {
                        name: 'ASCVD Risk Calculator',
                        description: 'Estimates 10-year atherosclerotic cardiovascular disease risk',
                        url: 'http://tools.acc.org/ASCVD-Risk-Estimator-Plus/',
                        inputs: ['age', 'sex', 'race', 'cholesterol', 'blood_pressure', 'diabetes', 'smoking']
                    },
                    {
                        name: 'CHADS2-VASc Score',
                        description: 'Stroke risk assessment in atrial fibrillation',
                        inputs: ['age', 'sex', 'heart_failure', 'hypertension', 'stroke_history', 'vascular_disease', 'diabetes']
                    }
                ],
                'diabetes': [
                    {
                        name: 'eGFR Calculator',
                        description: 'Estimated glomerular filtration rate',
                        inputs: ['age', 'sex', 'race', 'creatinine']
                    },
                    {
                        name: 'HbA1c to Average Glucose',
                        description: 'Converts HbA1c to estimated average glucose',
                        inputs: ['hba1c']
                    }
                ]
            };

            return calculators[condition.toLowerCase()] || [];
        } catch (error) {
            console.error('Medical calculators error:', error);
            return [];
        }
    }

    /**
     * Comprehensive research integration
     */
    async comprehensiveResearch(query, options = {}) {
        try {
            const results = {
                literature: [],
                clinicalTrials: [],
                diagnosticCriteria: null,
                treatmentGuidelines: null,
                drugInteractions: [],
                icdCodes: null,
                calculators: [],
                timestamp: new Date().toISOString()
            };

            // Parallel searches
            const [
                literature,
                trials,
                criteria,
                guidelines,
                icdCodes,
                calculators
            ] = await Promise.all([
                this.searchPubMed(query, { limit: 5 }),
                this.searchClinicalTrials(query, { limit: 3 }),
                this.getDiagnosticCriteria(query),
                this.getTreatmentGuidelines(query),
                this.getICD10Codes(query),
                this.getMedicalCalculators(query)
            ]);

            results.literature = literature;
            results.clinicalTrials = trials;
            results.diagnosticCriteria = criteria;
            results.treatmentGuidelines = guidelines;
            results.icdCodes = icdCodes;
            results.calculators = calculators;

            // Check drug interactions if medications provided
            if (options.medications?.length) {
                results.drugInteractions = await this.checkDrugInteractions(options.medications);
            }

            return results;
        } catch (error) {
            console.error('Comprehensive research error:', error);
            throw error;
        }
    }

    /**
     * Calculate relevance score for research results
     */
    calculateRelevance(article, query) {
        try {
            const queryTerms = query.toLowerCase().split(' ');
            const title = article.title?.toLowerCase() || '';
            const abstract = article.summary?.toLowerCase() || '';

            let score = 0;

            queryTerms.forEach(term => {
                if (title.includes(term)) score += 3;
                if (abstract.includes(term)) score += 1;
            });

            // Boost recent articles
            const currentYear = new Date().getFullYear();
            const articleYear = parseInt(article.pubdate?.split('/')[0]) || 2000;
            if (articleYear >= currentYear - 2) score += 2;
            else if (articleYear >= currentYear - 5) score += 1;

            return Math.min(score, 100);
        } catch (error) {
            return 50; // Default relevance
        }
    }
}

module.exports = new HealthcareResearchService();