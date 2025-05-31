import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({ 
    company_name: {
        type: String,
        required: true,
        trim: true
    },
    job_title: {
        type: String,
        required: true,
        trim: true
    },
    job_location: {
        type: String,
        required: true,
        trim: true
    },
    apply_link: {
        type: String,
        required: true,
        trim: true
    },
    job_description: {
        type: String,
        required: true,
        trim: true
    },
    source: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

jobSchema.index({ job_title: 'text', description: 'text', company_name: 'text' })

export const Job = mongoose.model('Job', jobSchema)