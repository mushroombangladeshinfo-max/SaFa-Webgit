import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main:      './index.html',
        home:      './home.html',
        orders:    './orders.html',
        dashboard: './dashboard.html',
        product:   './product.html',
        recipes:   './recipes.html',
        checkout:  './checkout.html',
        account:   './account.html',
        track:     './track.html',
        quickLog:      './quick-log.html',
        farmAnalytics: './farm-analytics.html',
        expenses:      './expenses.html',
        pipeline:      './pipeline.html',
        customers:     './customers.html',
        products:      './products.html',
        insights:      './insights.html',
        harvestLog:    './harvest-log.html',
        spawnLab:      './spawn-lab.html',
        jobDashboard:     './job-dashboard.html',
        jobOpportunities: './job-opportunities.html',
        jobOpportunity:   './job-opportunity.html',
        jobContacts:      './job-contacts.html',
        jobInterviews:    './job-interviews.html',
        jobCopilot:       './job-copilot.html',
        jobSettings:      './job-settings.html',
        jobActivities:    './job-activities.html',
        jobOffers:        './job-offers.html',
        jobSkills:        './job-skills.html',
        jobAnalytics:     './job-analytics.html',
        jobResumes:       './job-resumes.html',
        jobQuickLog:      './job-quick-log.html',
      }
    }
  }
});
