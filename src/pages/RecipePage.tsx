import { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RecipeContext } from '../context/RecipeContext';
import useInstructions from '../hooks/useInstructions';
import Wrapper from '../components/Wrapper';
import Box from '../components/Box';
import Typography from '../components/Typography';
import RecipeMeta from '../components/RecipeMeta';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeInstructions from '../components/RecipeInstructions';
import Loader from '../components/Loader';

const { Title } = Typography;

const StyledRecipePage = styled.div`
	padding: 3.2rem 0;
	@media (min-width: 56.25em) {
		.grid {
			margin-top: 4.8rem;
			display: grid;
			align-items: start;
			grid-template-columns: 1fr 21.6rem;
		}
		.recipe {
			grid-row: 1;
		}
	}
	.back {
		color: #fff;
	}
`;

const Image = styled.img`
	display: block;
	margin: 4rem auto;
`;

function RecipePage() {
	const [isLoading, setLoading] = useState(true);

	const history = useHistory();
	const { id } = useParams<{ id: string }>();

	const { recipe, error, getRecipe, setError } = useContext(RecipeContext);

	const [
		instructions,
		loadingInstructions,
		instructionsError,
	] = useInstructions(+id);

	useEffect(() => {
		// Si no es un número redirige y coloca el error;
		if (window.isNaN(+id)) {
			setError('The recipe id was not valid');
			return history.replace('/');
		}
		getRecipe(+id).finally(() => setLoading(false));
	}, [id, getRecipe, history, setError]);

	if (isLoading) {
		return (
			<Box>
				<Loader center={true} />
			</Box>
		);
	}

	if (!recipe && error) {
		return <Redirect to="/" />;
	}

	return (
		<StyledRecipePage>
			<Wrapper>
				<Link to="/" className="back">
					<span className="material-icons">arrow_back</span>
				</Link>
				<Title center={true} variant="h1">
					{recipe?.title}
				</Title>
				<Image
					width={556}
					height={370}
					src={recipe?.image}
					alt={recipe?.title}
				/>
				<div className="grid">
					<RecipeMeta
						servings={recipe?.servings}
						readyIn={recipe?.readyInMinutes}
					/>
					<div className="recipe">
						<RecipeIngredients
							ingredients={recipe?.extendedIngredients || []}
						/>
						{loadingInstructions ? (
							<Box>
								<Loader center={true} />
							</Box>
						) : (
							<RecipeInstructions
								instructionsError={instructionsError}
								instructions={instructions}
							/>
						)}
					</div>
				</div>
			</Wrapper>
		</StyledRecipePage>
	);
}

export default RecipePage;
