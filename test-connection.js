#!/usr/bin/env node

/**
 * Connection Test Script for Birth Health Network
 * Tests database, backend API, and frontend connectivity
 */

const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class ConnectionTester {
    constructor() {
        this.results = {
            database: { status: 'pending', message: '', timestamp: null },
            backend: { status: 'pending', message: '', timestamp: null },
            frontend: { status: 'pending', message: '', timestamp: null },
            integration: { status: 'pending', message: '', timestamp: null }
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const colors = {
            info: '\x1b[36m',      // Cyan
            success: '\x1b[32m',   // Green
            error: '\x1b[31m',     // Red
            warning: '\x1b[33m',   // Yellow
            reset: '\x1b[0m'       // Reset
        };

        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    async testDatabase() {
        this.log('Testing database connection...', 'info');

        try {
            // Test if PostgreSQL container is running
            const { stdout } = await execAsync('docker-compose ps postgres');

            if (stdout.includes('healthy') || stdout.includes('Up')) {
                // Test database connectivity
                await execAsync('docker-compose exec -T postgres pg_isready -U bhn_user -d birth_health_network');

                this.results.database = {
                    status: 'success',
                    message: 'Database is running and accessible',
                    timestamp: new Date().toISOString()
                };
                this.log('✅ Database connection successful', 'success');
            } else {
                throw new Error('PostgreSQL container is not running');
            }
        } catch (error) {
            this.results.database = {
                status: 'error',
                message: `Database connection failed: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            this.log(`❌ Database connection failed: ${error.message}`, 'error');
        }
    }

    async testBackend() {
        this.log('Testing backend API...', 'info');

        try {
            // Test health endpoint
            const healthResponse = await axios.get('http://localhost:3001/health', {
                timeout: 5000
            });

            if (healthResponse.status === 200 && healthResponse.data.status === 'healthy') {
                // Test API documentation endpoint
                const apiResponse = await axios.get('http://localhost:3001/api', {
                    timeout: 5000
                });

                if (apiResponse.status === 200) {
                    this.results.backend = {
                        status: 'success',
                        message: `Backend API is running (v${healthResponse.data.version})`,
                        timestamp: new Date().toISOString()
                    };
                    this.log('✅ Backend API is healthy', 'success');
                } else {
                    throw new Error('API endpoint not responding');
                }
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            this.results.backend = {
                status: 'error',
                message: `Backend API failed: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            this.log(`❌ Backend API failed: ${error.message}`, 'error');
        }
    }

    async testFrontend() {
        this.log('Testing frontend application...', 'info');

        try {
            // Test if frontend is accessible (production setup)
            let frontendUrl = 'http://localhost';
            let response;

            try {
                response = await axios.get(frontendUrl, { timeout: 5000 });
            } catch (prodError) {
                // Try development server
                frontendUrl = 'http://localhost:3000';
                response = await axios.get(frontendUrl, { timeout: 5000 });
            }

            if (response.status === 200) {
                this.results.frontend = {
                    status: 'success',
                    message: `Frontend is accessible at ${frontendUrl}`,
                    timestamp: new Date().toISOString()
                };
                this.log(`✅ Frontend accessible at ${frontendUrl}`, 'success');
            } else {
                throw new Error('Frontend not responding');
            }
        } catch (error) {
            this.results.frontend = {
                status: 'error',
                message: `Frontend connection failed: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            this.log(`❌ Frontend connection failed: ${error.message}`, 'error');
        }
    }

    async testIntegration() {
        this.log('Testing API integration...', 'info');

        try {
            if (this.results.backend.status !== 'success') {
                throw new Error('Backend API must be running for integration test');
            }

            // Test user registration
            const testUser = {
                firstName: 'Test',
                lastName: 'User',
                email: `test_${Date.now()}@example.com`,
                password: 'TestPassword123!',
                userType: 'doctor'
            };

            const registerResponse = await axios.post('http://localhost:3001/api/auth/register', testUser, {
                timeout: 10000
            });

            if (registerResponse.status === 201 && registerResponse.data.success) {
                // Test login
                const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
                    email: testUser.email,
                    password: testUser.password
                }, {
                    timeout: 10000
                });

                if (loginResponse.status === 200 && loginResponse.data.success) {
                    const token = loginResponse.data.data.accessToken;

                    // Test authenticated endpoint
                    const dashboardResponse = await axios.get('http://localhost:3001/api/dashboard', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        timeout: 10000
                    });

                    if (dashboardResponse.status === 200 && dashboardResponse.data.success) {
                        this.results.integration = {
                            status: 'success',
                            message: 'Full API integration test successful',
                            timestamp: new Date().toISOString()
                        };
                        this.log('✅ API integration test successful', 'success');
                    } else {
                        throw new Error('Dashboard API test failed');
                    }
                } else {
                    throw new Error('Login test failed');
                }
            } else {
                throw new Error('Registration test failed');
            }
        } catch (error) {
            this.results.integration = {
                status: 'error',
                message: `API integration test failed: ${error.message}`,
                timestamp: new Date().toISOString()
            };
            this.log(`❌ API integration test failed: ${error.message}`, 'error');
        }
    }

    async runAllTests() {
        this.log('🚀 Starting Birth Health Network Connection Tests', 'info');
        this.log('='.repeat(60), 'info');

        await this.testDatabase();
        await this.testBackend();
        await this.testFrontend();
        await this.testIntegration();

        this.log('='.repeat(60), 'info');
        this.log('📊 Test Results Summary:', 'info');

        Object.entries(this.results).forEach(([component, result]) => {
            const status = result.status === 'success' ? '✅' : '❌';
            const color = result.status === 'success' ? 'success' : 'error';
            this.log(`${status} ${component.toUpperCase()}: ${result.message}`, color);
        });

        const successCount = Object.values(this.results).filter(r => r.status === 'success').length;
        const totalTests = Object.keys(this.results).length;

        this.log('='.repeat(60), 'info');

        if (successCount === totalTests) {
            this.log(`🎉 All tests passed! (${successCount}/${totalTests})`, 'success');
            this.log('Your Birth Health Network is ready to use!', 'success');
        } else {
            this.log(`⚠️  ${successCount}/${totalTests} tests passed`, 'warning');
            this.log('Please check the failing components above', 'warning');
        }

        return this.results;
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: Object.keys(this.results).length,
                passed: Object.values(this.results).filter(r => r.status === 'success').length,
                failed: Object.values(this.results).filter(r => r.status === 'error').length
            },
            details: this.results
        };

        return JSON.stringify(report, null, 2);
    }
}

// CLI execution
if (require.main === module) {
    const tester = new ConnectionTester();

    tester.runAllTests()
        .then((results) => {
            // Save report
            const fs = require('fs');
            const report = tester.generateReport();
            fs.writeFileSync('connection-test-report.json', report);

            console.log('\n📄 Test report saved to: connection-test-report.json');

            // Exit with appropriate code
            const allPassed = Object.values(results).every(r => r.status === 'success');
            process.exit(allPassed ? 0 : 1);
        })
        .catch((error) => {
            console.error('Test runner failed:', error);
            process.exit(1);
        });
}

module.exports = ConnectionTester;