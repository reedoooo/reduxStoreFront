import React, { useEffect as startEffect } from 'react';
import {
  useSelector as selectState,
  useDispatch as dispatchAction,
} from 'react-redux';
import { Box, Typography as TextUI, Paper as PaperUI } from '@mui/material';
import { styled } from '@mui/system';
import categoriesSlice, { retrieveCategories } from '../../store/categories';
import { loadProductsFromAPI } from '../../store/products';

const StyledPaper = styled(PaperUI)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  cursor: 'pointer',
  '&.activeCategory': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function Categories() {
  const categories = selectState((storefront) => storefront.categories);
  const dispatch = dispatchAction();

  let { loadCategories, changeActiveCategory, resetActiveCategory } =
    categoriesSlice.actions;

  const handleCategoryInteraction = (event) => {
    if (
      event.target.innerText.toLowerCase() === categories.selectedCategory.name
    ) {
      dispatch(resetActiveCategory({}));
      let categorySelectors =
        document.getElementsByClassName('selectedCategory');
      for (let i = 0; i < categorySelectors.length; i++) {
        categorySelectors[i].classList.remove('selectedCategory');
      }
    } else {
      dispatch(changeActiveCategory(event.target.innerText));
      let categorySelectors =
        document.getElementsByClassName('selectedCategory');
      for (let i = 0; i < categorySelectors.length; i++) {
        categorySelectors[i].classList.remove('selectedCategory');
      }
      event.target.classList.add('selectedCategory');
      dispatch(loadProductsFromAPI());
    }
  };

  startEffect(() => {
    dispatch(retrieveCategories()).then((response) =>
      dispatch(loadCategories(response))
    );
  }, []);

  return categories.categories ? (
    <>
      <TextUI variant="h5" component="div">
        Categories:
      </TextUI>
      <Box
        component="div"
        id="categoryContainer"
        data-testid="categoryContainer"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // adapt this to your needs
          gridGap: '1em',
        }}
      >
        {categories.categories.map((category) => {
          return (
            <StyledPaper
              key={`paper_${category.name}`}
              data-testid={`paper_${category.name}`}
              onClick={handleCategoryInteraction}
              elevation={4}
              className="categorySelector"
            >
              {category.name[0].toUpperCase() + category.name.slice(1)}
            </StyledPaper>
          );
        })}
      </Box>
    </>
  ) : null;
}

export default Categories;
