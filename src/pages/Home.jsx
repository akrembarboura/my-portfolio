import About from '../components/About'
import CompetencyPipeline from '../components/CompetencyPipeline'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import SectionDivider from '../components/SectionDivider'

export default function Home() {
    return (
        <>
            <About />
            <SectionDivider />
            <CompetencyPipeline />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Experience />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Contact />
        </>
    )
}
