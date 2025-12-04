# Contributing to PhysVerse

Thank you for your interest in contributing to PhysVerse! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS)

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue describing:
   - Use case
   - Proposed solution
   - Alternative approaches
   - Mockups if applicable

### Pull Requests

1. **Fork the repository**
```bash
git clone https://github.com/yourusername/physverse.git
cd physverse
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow code standards
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   - Run the application locally
   - Test all affected features
   - Check for console errors
   - Verify responsive design

5. **Commit your changes**
```bash
git add .
git commit -m "feat: add new simulation type"
```

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots if UI changes
   - Wait for review

## Commit Message Guidelines

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add collision detection to projectile simulation
fix: resolve CORS issue in production
docs: update API documentation
refactor: extract physics calculations to utility
```

## Code Standards

### TypeScript
- Use strict mode
- Define explicit types
- Avoid `any` type
- Document complex functions

### React
- Use functional components
- Keep components focused
- Extract reusable logic
- Use proper prop types

### Styling
- Use Tailwind CSS classes
- Follow existing patterns
- Ensure responsive design
- Test on multiple devices

### Testing
- Test new features manually
- Verify edge cases
- Check error handling
- Test on different browsers

## Project Structure

```
physverse/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── backend/           # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
└── docs/              # Documentation
```

## Development Workflow

1. **Setup development environment**
   - Install dependencies
   - Configure environment variables
   - Start MongoDB
   - Run dev servers

2. **Make changes**
   - Write code
   - Test locally
   - Fix issues

3. **Submit PR**
   - Push to fork
   - Create pull request
   - Address feedback

## Adding New Simulations

To add a new simulation type:

1. Update `SimulationType` enum
2. Create simulation component
3. Add to `SimulationCanvas`
4. Add controls in `SimulationControls`
5. Update backend validator
6. Test thoroughly
7. Document parameters

See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for details.

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues/PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
